define(["frm/table"],function(table){
	
	
	table.init("table",{
		url:'data.json?'+new Date(),
		pagination:true,
		sidePagination:"server",
		showRefresh:true,
		pageSize:10,
		pageList:[10,20,30],
		search:true,
		//showRefresh:true,
		showColumns:true,
		iconSize:'sm',
		showExport:'true',
        columns: [
            [
                {
                    field: 'state',
                    checkbox: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle'
                }, {
                    title: 'Item ID',
                    field: 'id',
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    sortable: true
                }, {
                    title: 'Item Detail',
                    colspan: 3,
                    align: 'center'
                }
            ],
            [
                {
                    field: 'name',
                    title: 'Item Name',
                    sortable: true,
                    editable: true,
                    align: 'center'
                }, {
                    field: 'price',
                    title: 'Item Price',
                    sortable: true,
                    align: 'center'
                }, {
                    field: 'operate',
                    title: 'Item Operate',
                    align: 'center'
                }
            ]
        ]
		
	});
	
});